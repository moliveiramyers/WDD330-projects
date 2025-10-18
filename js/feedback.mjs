export async function renderPage() {
  const html = `
  <section class="feedback-page fade-in">
    <h2>💬 Envie o Seu Feedback</h2>
    <form id="feedback-form" class="feedback-form">
      
      <label for="topic">Escolha o tópico:</label>
      <select id="topic" name="topic" required>
        <option value="" disabled selected>Selecione</option>
        <option value="Sugestão">Sugestão</option>
        <option value="Elogio">Elogio</option>
        <option value="Reclamação">Reclamação</option>
        <option value="Pergunta">Pergunta</option>
      </select>

      <label for="subject">Assunto:</label>
      <input type="text" id="subject" name="subject" placeholder="Escreva o título do seu feedback" required />

      <label for="message">Mensagem:</label>
      <textarea id="message" name="message" rows="5" placeholder="Escreva o seu feedback aqui..." required></textarea>

      <button type="submit" class="submit-btn">Enviar</button>

      <p id="feedback-status" class="feedback-status"></p>
    </form>

    </div>
  </section>
  `;

  // Add event listener after the page is rendered
  setTimeout(() => {
    const form = document.getElementById("feedback-form");
    const status = document.getElementById("feedback-status");
    // const feedbackList = document.getElementById("feedback-list");

    // Load saved feedback
    const savedFeedback = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    // renderFeedbackList(savedFeedback, feedbackList);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const feedback = {
        topic: form.topic.value,
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        date: new Date().toLocaleString(),
      };

      if (!feedback.subject || !feedback.message) {
        status.textContent = "Por favor, preencha todos os campos.";
        status.classList.add("error");
        return;
      }

      savedFeedback.push(feedback);
      localStorage.setItem("feedbacks", JSON.stringify(savedFeedback));

    //   renderFeedbackList(savedFeedback, feedbackList);

      status.textContent = "✅ Feedback enviado com sucesso!";
      status.classList.remove("error");
      status.classList.add("success");

      form.reset();
    });
  }, 100);

  return html;
}

// Helper: render list of feedbacks
function renderFeedbackList(feedbacks, container) {
  container.innerHTML = "";
  if (feedbacks.length === 0) {
    container.innerHTML = "<p>Nenhum feedback enviado ainda.</p>";
    return;
  }

  feedbacks.slice().reverse().forEach(fb => {
    const li = document.createElement("li");
    li.classList.add("feedback-item", "slide-up");
    li.innerHTML = `
      <strong>${fb.topic}</strong> — <em>${fb.subject}</em><br>
      <p>${fb.message}</p>
      <small>${fb.date}</small>
    `;
    container.appendChild(li);
  });
}
