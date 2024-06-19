document.addEventListener('DOMContentLoaded', function(event) {
	  document.getElementById('orderIdInput').value = '{{id}}';
	});

	function SignaturePadWrapper() {
	  const canvas = document.getElementById('signatureCanvas');
	  const signatureModal = document.getElementById('signatureModal');
	  const signaturePad = new SignaturePad(canvas);
	  const orderIdInput = document.getElementById('orderIdInput');

	  const openModal = () => {
		signatureModal.style.display = 'flex';
		resizeCanvas();
	  };

	  const saveSignature = () => {
  if (signaturePad.isEmpty()) {
    alert("Please provide a signature first.");
    return;
  }

  const signatureData = signaturePad.toDataURL();
  const orderId = orderIdInput.value;

  // Replace contents of .footer-signature with the signature image
  const footerSignatureDiv = document.querySelector('.footer-signature');
  footerSignatureDiv.innerHTML = `<img src="${signatureData}" alt="Signature">`; // Ensure this is the correct class

  captureReceipt(orderId)
    .then(() => {
      signaturePad.clear();
      signatureModal.style.display = 'none';
      footerSignatureDiv.innerHTML = ''; // Clear the signature from .footer-signature if needed
    })
    .catch(error => console.error('Error:', error));
};

const captureReceipt = async (orderId) => {
  const receiptCanvas = await html2canvas(document.querySelector('.receipt-container'));
  const imgData = receiptCanvas.toDataURL();

  // Send screenshot to API
  const response = await fetch('https://api1.royalcastlemiami.com/webhook/efaa1858-7660-40cc-b8d0-15cbc10df744-sign-receipt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: orderId,
      img: imgData,
    }),
  });

  const data = await response.json();
  console.log('Success:', data);
};

	  const resizeCanvas = () => {
		const ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext("2d").scale(ratio, ratio);
	  };

	  document.getElementById('signReceipt').addEventListener('click', openModal);
	  document.getElementById('saveSignature').addEventListener('click', saveSignature);
	  window.addEventListener('resize', resizeCanvas);

	  // Show signature on modal open (assuming signaturePad is already initialized)
	  openModal();
	}

	new SignaturePadWrapper();
