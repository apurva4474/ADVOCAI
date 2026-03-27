const handleSubmit = async (e) => {
  e.preventDefault();

  await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });

  alert("Message sent!");
};