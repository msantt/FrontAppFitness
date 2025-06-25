export async function getEnderecoFromLatLng(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "AppFitness/1.0 (contato@abstrasoft.com.br)",
        },
      }
    );
    const data = await response.json();

    const { road, pedestrian, neighbourhood, city, town, village } =
      data.address;

    const rua = road || pedestrian || neighbourhood || "Local não identificado";
    const cidade = city || town || village || "";

    return `${rua}${cidade ? ", " + cidade : ""}`;
  } catch (error) {
    return null;
  }
}
