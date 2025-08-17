// /src/js/auth.js
document.addEventListener('DOMContentLoaded', function() {
  // Inisialisasi Supabase
  const supabase = supabase.createClient(
    window.supabaseConfig.supabaseUrl, 
    window.supabaseConfig.supabaseKey
  );

  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const loginSuccess = document.getElementById('login-success');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    loginError.classList.add('hidden');
    loginSuccess.classList.add('hidden');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      // 1. Login dengan email & password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // 2. Verifikasi role admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_approved, approved_by')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // 3. Cek apakah user adalah admin yang disetujui
      if (profile.role !== 'admin' || !profile.is_approved) {
        await supabase.auth.signOut();
        throw new Error('Hanya admin yang disetujui yang dapat mengakses');
      }
      
      // 4. Jika berhasil, redirect ke dashboard
      showSuccess('Login berhasil! Mengarahkan...');
      setTimeout(() => {
        window.location.href = '/admin-dashboard.html';
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      showError(error.message || 'Login gagal. Silakan coba lagi.');
    }
  });

  function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
    loginSuccess.classList.add('hidden');
  }

  function showSuccess(message) {
    loginSuccess.textContent = message;
    loginSuccess.classList.remove('hidden');
    loginError.classList.add('hidden');
  }
});