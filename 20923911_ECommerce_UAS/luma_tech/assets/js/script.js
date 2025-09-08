document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Pesan Anda berhasil dikirim! Terima kasih telah menghubungi Luma Tech.");
      form.reset();
    });
  }
});
