export const generateRoomImage = async (roomData) => {
  const { dimensions, style, colorPalette, materials, layout } = roomData;

  const prompt = `
      Interior design of a ${dimensions.width}x${dimensions.length} ft room in ${style} style.
      Use these colors: ${colorPalette.join(", ")}.
      Include materials like: ${materials.join(", ")}.
      Furniture: ${layout.map(obj => obj.subType || obj.type).join(", ")}.
      Realistic, soft lighting, high detail, 3D render.`.trim();

  console.log("✨ Sending to Stability AI:", prompt);

  const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: prompt,
        },
      ],
      output_format: "png",
      model: "stable-diffusion-xl-v1",
      aspect_ratio: "1:1",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Stability API error:", errorData);
    return null;
  }

  const data = await response.json();
  const imageUrl = data?.image;

  console.log("✅ Stability AI image URL:", imageUrl);
  return imageUrl || null;
};
