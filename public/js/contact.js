document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formMessage = document.getElementById('formMessage');
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  // Show loading state
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  formMessage.classList.add('hidden');
  
  try {
    console.log('Sending contact form data:', formData);
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Response data:', result);
    
    if (result.success) {
      // Show success message
      formMessage.textContent = 'Message received. We\'ll be in touch.';
      formMessage.className = 'mt-4 text-center text-white uppercase tracking-widest text-sm';
      formMessage.classList.remove('hidden');
      
      // Reset form
      e.target.reset();
    } else {
      // Show error message
      formMessage.textContent = result.message || 'Failed to send message. Please try again.';
      formMessage.className = 'mt-4 text-center text-red-400 uppercase tracking-widest text-sm';
      formMessage.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Network error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Show error message
    formMessage.textContent = 'Network error. Please try again.';
    formMessage.className = 'mt-4 text-center text-red-400 uppercase tracking-widest text-sm';
    formMessage.classList.remove('hidden');
  } finally {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});
