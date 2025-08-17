// /src/js/admin-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
  // Inisialisasi Supabase
  const supabase = supabase.createClient(
    window.supabaseConfig.supabaseUrl, 
    window.supabaseConfig.supabaseKey
  );

  // Fungsi utama
  async function initAdminDashboard() {
    // 1. Cek session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session) {
      window.location.href = '/auth.html';
      return;
    }
    
    // 2. Verifikasi role admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_approved')
      .eq('id', session.user.id)
      .single();
    
    if (profileError || profile.role !== 'admin' || !profile.is_approved) {
      await supabase.auth.signOut();
      window.location.href = '/auth.html';
      return;
    }
    
    // 3. Load data timeline
    loadTimeline();
    
    // 4. Setup event listeners
    setupEventListeners();
  }

  // Fungsi untuk load data
  async function loadTimeline() {
    try {
      const { data, error } = await supabase
        .from('timeline')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      renderTimeline(data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data');
    }
  }

  // Fungsi render timeline
  function renderTimeline(items) {
    const container = document.getElementById('timeline-list');
    if (!container) return;
    
    if (items.length === 0) {
      container.innerHTML = '<p class="text-center py-8">Belum ada data timeline</p>';
      return;
    }
    
    container.innerHTML = items.map(item => `
      <div class="timeline-item bg-gray-700 rounded-lg p-4 mb-4">
        <h3 class="font-bold text-lg">${item.title}</h3>
        <p class="text-gray-400 text-sm">${new Date(item.date).toLocaleDateString()}</p>
        <p class="text-gray-300 mt-2">${item.description}</p>
        <div class="flex justify-end space-x-2 mt-3">
          <button onclick="editTimeline('${item.id}')" class="text-blue-400 hover:text-blue-300">
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button onclick="deleteTimeline('${item.id}')" class="text-red-400 hover:text-red-300">
            <iconify-icon icon="mdi:trash"></iconify-icon>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Fungsi untuk event listeners
  function setupEventListeners() {
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = '/auth.html';
    });
    
    // Modal
    document.getElementById('add-timeline-btn')?.addEventListener('click', () => {
      showModal();
    });
    
    // Form submit
    document.getElementById('timeline-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveTimeline();
    });
  }

  // Fungsi bantuan
  window.editTimeline = async (id) => {
    const { data, error } = await supabase
      .from('timeline')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(error);
      return;
    }
    
    showModal(data);
  };

  window.deleteTimeline = async (id) => {
    if (!confirm('Hapus item ini?')) return;
    
    const { error } = await supabase
      .from('timeline')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(error);
      alert('Gagal menghapus');
    } else {
      loadTimeline();
    }
  };

  function showModal(data = null) {
    const modal = document.getElementById('timeline-modal');
    const form = document.getElementById('timeline-form');
    
    if (data) {
      form.elements['timeline-id'].value = data.id;
      form.elements['title'].value = data.title;
      form.elements['date'].value = data.date.split('T')[0];
      form.elements['description'].value = data.description;
      form.elements['tags'].value = data.tags?.join(', ') || '';
    } else {
      form.reset();
    }
    
    modal.classList.remove('hidden');
  }

  async function saveTimeline() {
    const form = document.getElementById('timeline-form');
    const id = form.elements['timeline-id'].value;
    const data = {
      title: form.elements['title'].value,
      date: form.elements['date'].value,
      description: form.elements['description'].value,
      tags: form.elements['tags'].value.split(',').map(t => t.trim()).filter(t => t)
    };
    
    try {
      if (id) {
        // Update
        const { error } = await supabase
          .from('timeline')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('timeline')
          .insert(data);
        
        if (error) throw error;
      }
      
      document.getElementById('timeline-modal').classList.add('hidden');
      loadTimeline();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan data');
    }
  }

  // Jalankan init
  initAdminDashboard();
});