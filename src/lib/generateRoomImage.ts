export const generateRoomImage = async (roomData) => {
    const { dimensions, style, colorPalette, materials, layout } = roomData;
  
    const prompt = `
  Interior design of a ${dimensions.width}x${dimensions.length} ft room in ${style} style.
  Use these colors: ${colorPalette.join(", ")}.
  Include materials like: ${materials.join(", ")}.
  Furniture: ${layout.map(obj => obj.subType || obj.type).join(", ")}.
  Realistic, soft lighting, high detail, 3D render.`.trim();
  
    console.log("✨ Sending to Replicate:", prompt);
  
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a9758cb3b1e01c3ad1343c0e30d240e28a6d480c2b777b9e744e89b469d6b413", // SDXL
        input: {
          prompt,
          width: 1024,
          height: 1024,
        },
      }),
    });
  
    const prediction = await response.json();
  
    if (!prediction.urls?.get) {
      console.error("❌ Failed to queue prediction:", prediction);
      return null;
    }
  
    // Poll until image is ready
    let image = null;
    for (let i = 0; i < 20; i++) {
      const pollRes = await fetch(prediction.urls.get, {
        headers: { Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_KEY}` },
      });
      const pollData = await pollRes.json();
  
      if (pollData.status === "succeeded") {
        image = pollData.output?.[0];
        break;
      } else if (pollData.status === "failed") {
        console.error("❌ Prediction failed:", pollData);
        return null;
      }
  
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s before polling again
    }
  
    console.log("✅ Generated image:", image);
    return image;
  };
  