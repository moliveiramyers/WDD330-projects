export async function renderPage() {
  const html = `
  <section class="contact-page fade-in">
    <h2>📞 Contacte-nos</h2>
    <div class="contact-grid">
      
      <!-- PERSONAL INFO -->
      <div class="contact-card">
        <h3>Meus Contactos</h3>
        <p><strong>📱 Telefone:</strong> <a href="tel:+351965883627">+351 965 883 627</a></p>
        <p><strong>✉️ Email:</strong> <a href="mailto:moliveiramyers@byupathway.edu">moliveiramyers@byupathway.edu</a></p>
        <div class="map-wrapper">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!4m2!3m1!1s0xd24456acbace43b:0xe604765715d45ba3"
            width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy">
          </iframe>
        </div>
      </div>

      <!-- INSTITUTE INFO -->
      <div class="contact-card">
        <h3>📖 Instituto</h3>
        <p><strong>🗓 Dias:</strong> Quintas ou Sextas-feiras</p>
        <p><strong>🕒 Horário:</strong> 19:30 - 20:30</p>
        <p><strong>📱 Telefone:</strong> <a href="tel:+351965883627">+351 965 883 627</a></p>
        <p><strong>✉️ Email:</strong> <a href="mailto:moliveiramyers@byupathway.edu">moliveiramyers@byupathway.edu</a></p>
        <p><strong>📍 Local:</strong> 
          <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xd24456acbace43b:0xe604765715d45ba3?sa=X&ved=1t:8290&ictx=111" target="_blank">
            Ver no Google Maps
          </a>
        </p>
      </div>

      <!-- SOCIAL MEDIA -->
      <div class="contact-card social-card">
        <h3>🌍 Redes Sociais</h3>
        <p>Segue-nos no Instagram:</p>
        <a href="https://www.instagram.com/ja_povoa_de_varzim?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
          target="_blank" class="insta-link">
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" class="insta-icon" />
          <span>@ja_povoa_de_varzim</span>
        </a>
      </div>

    </div>
  </section>
  `;

  setTimeout(() => {
    document.querySelectorAll('.contact-card').forEach(card => {
      card.classList.add('slide-up');
    });
  }, 100);

  return html;
}
