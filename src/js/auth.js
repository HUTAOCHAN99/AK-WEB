// Wait for DOM and all scripts to load
window.addEventListener('DOMContentLoaded', async () => {
  // 1. First get DOM elements
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const loginSuccess = document.getElementById('login-success');
  
  // 2. Check if required elements exist
  if (!loginForm || !loginError || !loginSuccess) {
    console.error('Required DOM elements missing!');
    return;
  }

  // 3. Helper functions
  const showError = (message) => {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
    loginSuccess.classList.add('hidden');
  };

  const showSuccess = (message) => {
    loginSuccess.textContent = message;
    loginSuccess.classList.remove('hidden');
    loginError.classList.add('hidden');
  };

  // 4. Verify Supabase is loaded
  if (typeof supabase === 'undefined') {
    showError('System error: Authentication service unavailable');
    console.error('Supabase JS library not loaded!');
    return;
  }

  // 5. Verify config is loaded
  if (!window.supabaseConfig) {
    showError('System configuration error');
    console.error('Supabase config not found!');
    return;
  }

  // 6. Initialize Supabase client
  let supabaseClient;
  try {
    supabaseClient = supabase.createClient(
      window.supabaseConfig.supabaseUrl,
      window.supabaseConfig.supabaseKey
    );
    console.log('Supabase initialized successfully');
  } catch (err) {
    showError('System initialization failed');
    console.error('Supabase init error:', err);
    return;
  }

  // 7. Form submission handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    showSuccess('');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    try {
      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading">Authenticating...</span>';

      // Attempt login
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Verify admin status
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role, is_approved, status')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      
      // Check if user is approved admin with active status
      if (profile.role !== 'admin' || !profile.is_approved || profile.status !== 'active') {
        await supabaseClient.auth.signOut();
        throw new Error('Administrator privileges required. Please complete verification process.');
      }

      // Success - redirect
      showSuccess('Access granted. Redirecting...');
      setTimeout(() => {
        window.location.href = '/admin-dashboard.html';
      }, 1500);

    } catch (error) {
      showError(error.message || 'Authentication failed');
      console.error('Login error:', error);
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    }
  });
});