document.addEventListener('DOMContentLoaded', async function() {
  const verifyForm = document.getElementById('verify-form');
  const verifyError = document.getElementById('verify-error');
  const verifySuccess = document.getElementById('verify-success');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submit-btn');
  
  // Fungsi untuk menampilkan pesan error
  function showError(message) {
    verifyError.textContent = message;
    verifyError.classList.remove('hidden');
    verifySuccess.classList.add('hidden');
  }
  
  // Fungsi untuk menampilkan pesan sukses
  function showSuccess(message) {
    verifySuccess.innerHTML = message;
    verifySuccess.classList.remove('hidden');
    verifyError.classList.add('hidden');
  }
  
  // Inisialisasi Supabase client
  const supabaseClient = supabase.createClient(
    window.supabaseConfig.supabaseUrl,
    window.supabaseConfig.supabaseKey
  );
  
  // Ambil email dari localStorage
  const pendingEmail = localStorage.getItem('pendingVerificationEmail');
  if (pendingEmail) {
    emailInput.value = pendingEmail;
  } else {
    // Jika tidak ada email di localStorage, coba dapatkan dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    
    if (emailFromUrl) {
      emailInput.value = emailFromUrl;
      localStorage.setItem('pendingVerificationEmail', emailFromUrl);
    } else {
      showError('Sesi verifikasi tidak valid. Silakan daftar kembali.');
      setTimeout(() => {
        window.location.href = '/register.html';
      }, 3000);
      return;
    }
  }
  
  // Handler untuk form submission
  verifyForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    verifyError.classList.add('hidden');
    verifySuccess.classList.add('hidden');
    
    const email = emailInput.value;
    const code = document.getElementById('verification-code').value.trim();
    
    if (!code) {
      showError('Kode verifikasi harus diisi');
      return;
    }
    
    if (code.length !== 6) {
      showError('Kode verifikasi harus 6 digit');
      return;
    }
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Memverifikasi...';
      
      console.log('Memverifikasi kode untuk email:', email);
      
      // 1. Dapatkan user ID dari tabel profiles berdasarkan email
      const { data: userData, error: userError } = await supabaseClient
        .from('profiles')
        .select('id, status, full_name')
        .eq('email', email)
        .maybeSingle();
      
      console.log('Hasil query profiles:', userData, userError);
      
      if (userError) {
        console.error('Error query profiles:', userError);
        throw new Error('Terjadi kesalahan sistem. Silakan coba lagi.');
      }
      
      if (!userData) {
        throw new Error('Data pendaftaran tidak ditemukan. Silakan daftar ulang.');
      }
      
      const userId = userData.id;
      console.log('User ID ditemukan:', userId);
      
      // 2. Verifikasi kode
      const { data: codeData, error: codeError } = await supabaseClient
        .from('verification_codes')
        .select('*')
        .eq('code', code)
        .eq('user_id', userId)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      
      console.log('Hasil query verification_codes:', codeData, codeError);
      
      if (codeError) {
        console.error('Error query verification_codes:', codeError);
        throw new Error('Terjadi kesalahan sistem. Silakan coba lagi.');
      }
      
      if (!codeData) {
        // Cek apakah kode ada tapi sudah expired atau sudah digunakan
        const { data: expiredCode } = await supabaseClient
          .from('verification_codes')
          .select('*')
          .eq('code', code)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (expiredCode) {
          if (expiredCode.used_at) {
            throw new Error('Kode verifikasi sudah digunakan. Silakan minta kode baru.');
          } else if (new Date(expiredCode.expires_at) < new Date()) {
            throw new Error('Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.');
          }
        }
        
        throw new Error('Kode verifikasi tidak valid. Silakan periksa kembali.');
      }
      
      // 3. Update status user menjadi active dan set is_approved ke true
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ 
          status: 'active',
          is_approved: true,
          approved_at: new Date().toISOString(),
          verification_code: code
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error update profiles:', updateError);
        throw new Error('Gagal mengupdate status user. Silakan coba lagi.');
      }
      
      console.log('Status user berhasil diupdate menjadi active dan approved');
      
      // 4. Tandai kode verifikasi sebagai sudah digunakan
      const { error: markUsedError } = await supabaseClient
        .from('verification_codes')
        .update({ 
          used_at: new Date().toISOString()
        })
        .eq('id', codeData.id);
      
      if (markUsedError) {
        console.error('Error mark code as used:', markUsedError);
        // Lanjutkan saja meskipun gagal update status kode
      }
      
      // 5. Hapus email dari localStorage
      localStorage.removeItem('pendingVerificationEmail');
      
      // 6. Tampilkan sukses dan redirect ke login
      showSuccess(`
        ✅ Verifikasi berhasil!<br>
        Akun Anda telah aktif. Silakan login dengan email dan password Anda.
        <div class="mt-4">
          <a href="/auth.html" class="inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Login Sekarang
          </a>
        </div>
      `);
      
      console.log('Verifikasi berhasil untuk user:', userId);
      
    } catch (error) {
      console.error('Error dalam proses verifikasi:', error);
      showError(error.message || 'Verifikasi gagal. Silakan coba lagi.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verifikasi';
      }
    }
  });
  
  console.log('Verify.js loaded successfully');
});