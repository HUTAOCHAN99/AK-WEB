document.addEventListener('DOMContentLoaded', function() {
  // 1. Check if required DOM elements exist
  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');
  
  if (!registerForm || !registerError || !registerSuccess) {
    console.error('Critical DOM elements missing for registration');
    return;
  }

  // 2. Initialize with error handling
  try {
    initializeRegistration();
  } catch (error) {
    console.error('Initialization error:', error);
    showError('System initialization failed. Please refresh the page.');
  }

  function initializeRegistration() {
    // 3. Verify Supabase config is loaded
    if (!window.supabaseConfig) {
      throw new Error('Supabase configuration not loaded');
    }

    // 4. Verify Supabase library is available
    if (typeof supabase === 'undefined') {
      throw new Error('Supabase client library not loaded');
    }

    // 5. Create Supabase client
    const supabaseClient = supabase.createClient(
      window.supabaseConfig.supabaseUrl,
      window.supabaseConfig.supabaseKey
    );

    // 6. Set up form submission
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      clearMessages();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      // 7. Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        showError('All fields are required');
        return;
      }

      if (password !== confirmPassword) {
        showError("Passwords don't match");
        return;
      }

      if (password.length < 8) {
        showError("Password must be at least 8 characters");
        return;
      }

      try {
        // 8. Set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing...';

        // 9. Register user
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        if (authError) throw authError;

        // 10. Create profile with pending_verification status
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: name,
            email: email,
            role: 'admin',
            status: 'pending_verification',
            is_approved: false,
            approved_by: null
          });

        if (profileError) throw profileError;

        // 11. Generate verification code and send to admin
        await sendVerificationRequest(supabaseClient, email, name, authData.user.id);

        // 12. Save email to localStorage for verification page
        localStorage.setItem('pendingVerificationEmail', email);

        // 13. Show success with link to verification page
        showSuccess(`
          Registration submitted successfully!<br>
          Admin has received your verification code.<br>
          Please wait for the admin to provide you with the verification code.
          <div class="mt-4">
            <a href="/verify.html" class="inline-block bg-blue-600 text-white px-4 py-2 rounded">
              Enter Verification Code
            </a>
          </div>
        `);
        
        registerForm.reset();

      } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Registration failed. Please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Admin Access';
        }
      }
    });
  }

  async function sendVerificationRequest(supabaseClient, email, name, userId) {
    try {
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // 1. Save verification code to database
      const { error: codeError } = await supabaseClient
        .from('verification_codes')
        .insert({
          user_id: userId,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        });

      if (codeError) throw codeError;

      // 2. Send email to ADMIN with user data and verification code
      const { error: emailError } = await supabaseClient.functions.invoke('send-admin-email', {
        body: {
          to: window.supabaseConfig.adminEmail,
          subject: `New Admin Verification Request: ${name}`,
          html: `
            <h2>New Admin Verification Request</h2>
            <p>Applicant details:</p>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Verification Code:</strong> <span style="font-size: 24px; font-weight: bold; color: #3b82f6;">${verificationCode}</span></li>
              <li><strong>Request Time:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
            <p>Please provide this verification code to the applicant to complete their registration.</p>
            <p>Code valid until: ${expiresAt.toLocaleString('id-ID')}</p>
          `
        }
      });

      if (emailError) console.error('Email error:', emailError);

      // 3. Save notification for admin
      const { error: notificationError } = await supabaseClient
        .from('admin_notifications')
        .insert({
          target_email: window.supabaseConfig.adminEmail,
          subject: `Admin Verification Request: ${name}`,
          message: `User ${name} (${email}) is waiting for verification. Code: ${verificationCode}`,
          type: 'admin_verification',
          related_user_id: userId
        });

      if (notificationError) console.error('Notification error:', notificationError);

    } catch (error) {
      console.error('Error in verification process:', error);
      throw error;
    }
  }

  function clearMessages() {
    registerError.classList.add('hidden');
    registerSuccess.classList.add('hidden');
    registerError.textContent = '';
    registerSuccess.textContent = '';
  }

  function showError(message) {
    registerError.innerHTML = message;
    registerError.classList.remove('hidden');
    registerSuccess.classList.add('hidden');
  }

  function showSuccess(message) {
    registerSuccess.innerHTML = message;
    registerSuccess.classList.remove('hidden');
    registerError.classList.add('hidden');
  }
});