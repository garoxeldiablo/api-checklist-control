// Fungsi untuk memeriksa apakah koordinat berada dalam area yang valid
export const isWithinValidLocation = (latitude, longitude) => {
    // Koordinat lokasi gym
    const gymLatitude = 3.556885;  // Contoh latitude lokasi gym
    const gymLongitude = 98.626526; // Contoh longitude lokasi gym
    const allowedRadius = 0.001; // Radius dalam derajat (~1.1 km)

    // Menghitung jarak antara lokasi submit dan lokasi gym (menggunakan jarak Euclidean sederhana)
    const distance = Math.sqrt(
        Math.pow(latitude - gymLatitude, 2) + Math.pow(longitude - gymLongitude, 2)
    );

    return distance <= allowedRadius;  // TRUE jika dalam radius yang diizinkan
};