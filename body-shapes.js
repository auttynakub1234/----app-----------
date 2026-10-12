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
  reader.onload = async (e) => {
    // Get size input
    const sizeInput = document.getElementById(`shape-${shapeType}-size-input`);
    const size = sizeInput ? sizeInput.value : '';

    const data = {
      image: e.target.result,
      size: size,
      uploadedAt: new Date().toISOString()
    };

    localStorage.setItem(`body_shape_${shapeType}`, JSON.stringify(data));

    // Sync to Cloudflare KV
    try {
      await fetch('/api/bodyshapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shapeType, data })
      });
    } catch (err) {
      console.warn('Sync body shape to Cloudflare error:', err);
    }

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
async function removeBodyShape(shapeType) {
  const labels = {
    thin: 'ผอม',
    normal: 'ปกติ',
    fat: 'อ้วน'
  };

  if (confirm(`ต้องการลบรูปรูปร่าง${labels[shapeType]}หรือไม่?`)) {
    localStorage.removeItem(`body_shape_${shapeType}`);

    // Sync to Cloudflare KV
    try {
      await fetch('/api/bodyshapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shapeType, data: null })
      });
    } catch (err) {}

    alert(`ลบรูปรูปร่าง${labels[shapeType]}สำเร็จ`);
    location.reload();
  }
}

// Default fallback body shapes
const DEFAULT_BODY_SHAPES = {
  normal: {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    size: "รอบเอว 24-26 นิ้ว"
  },
  thin: {
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    size: "รอบเอว < 23 นิ้ว"
  },
  fat: {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    size: "รอบเอว > 30 นิ้ว"
  }
};

// Get Body Shape Data
function getBodyShapeData(shapeType) {
  const data = localStorage.getItem(`body_shape_${shapeType}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed && parsed.image) return parsed;
    } catch (e) {}
  }
  return DEFAULT_BODY_SHAPES[shapeType] || DEFAULT_BODY_SHAPES.normal;
}

// Dynamic shape image lookup by weight/interval (e.g. every 2-5 kg) and backend data
function getShapeImageByWeight(weight, bmi, defaultType = "normal") {
  if (typeof window === "undefined") return "";

  // 1. Check exact weight match (e.g. body_shape_52kg or body_shape_52)
  const roundWeight = Math.round(weight || 60);
  const exactKey = localStorage.getItem(`body_shape_${roundWeight}kg`) || localStorage.getItem(`body_shape_${roundWeight}`);
  if (exactKey) {
    try {
      const parsed = JSON.parse(exactKey);
      if (parsed && parsed.image) return parsed.image;
    } catch (e) {}
  }

  // 2. Check 2-5 kg interval tiers (e.g. 45, 50, 55, 60, 65, 70, 75, 80)
  const step5 = Math.round((weight || 60) / 5) * 5;
  const stepKey = localStorage.getItem(`body_shape_${step5}kg`) || localStorage.getItem(`body_shape_${step5}`);
  if (stepKey) {
    try {
      const parsed = JSON.parse(stepKey);
      if (parsed && parsed.image) return parsed.image;
    } catch (e) {}
  }

  const step2 = Math.round((weight || 60) / 2) * 2;
  const step2Key = localStorage.getItem(`body_shape_${step2}kg`) || localStorage.getItem(`body_shape_${step2}`);
  if (step2Key) {
    try {
      const parsed = JSON.parse(step2Key);
      if (parsed && parsed.image) return parsed.image;
    } catch (e) {}
  }

  // 3. Fallback to standard category (thin, normal, fat) from backend KV / localStorage
  let catType = defaultType;
  if (bmi) {
    if (bmi < 18.5) catType = "thin";
    else if (bmi <= 22.9) catType = "normal";
    else catType = "fat";
  }

  const catData = getBodyShapeData(catType);
  if (catData && catData.image) return catData.image;

  const normalData = getBodyShapeData("normal");
  if (normalData && normalData.image) return normalData.image;

  const fallbackUrls = {
    thin: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    normal: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    fat: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
  };
  return fallbackUrls[catType] || fallbackUrls.normal;
}

// Export for use in index.html
window.getBodyShapeData = getBodyShapeData;
window.getShapeImageByWeight = getShapeImageByWeight;
