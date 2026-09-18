// Body Shape Upload Handler
function handleBodyShapeUpload(event, shapeType) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate
  if (file.size > 2 * 1024 * 1024) {
    alert('ขนาดไฟล์ต้องไม่เกิน 2 MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    // Get size input
    const sizeInput = document.getElementById(`shape-${shapeType}-size-input`);
    const size = sizeInput ? sizeInput.value : '';

    const data = {
      image: e.target.result,
      size: size,
      uploadedAt: new Date().toISOString()
    };

    localStorage.setItem(`body_shape_${shapeType}`, JSON.stringify(data));

    const labels = {
      thin: 'ผอม',
      normal: 'ปกติ',
      fat: 'อ้วน'
    };

    alert(`อัปโหลดรูปรูปร่าง${labels[shapeType]}สำเร็จ!`);

    // Reload to show preview
    if (typeof loadBodyShapesPreviews === 'function') {
      loadBodyShapesPreviews();
    }
  };
  reader.readAsDataURL(file);
}

// Remove Body Shape
function removeBodyShape(shapeType) {
  const labels = {
    thin: 'ผอม',
    normal: 'ปกติ',
    fat: 'อ้วน'
  };

  if (confirm(`ต้องการลบรูปรูปร่าง${labels[shapeType]}หรือไม่?`)) {
    localStorage.removeItem(`body_shape_${shapeType}`);
    alert(`ลบรูปรูปร่าง${labels[shapeType]}สำเร็จ`);
    location.reload();
  }
}

// Get Body Shape Data
function getBodyShapeData(shapeType) {
  const data = localStorage.getItem(`body_shape_${shapeType}`);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

// Export for use in index.html
window.getBodyShapeData = getBodyShapeData;
