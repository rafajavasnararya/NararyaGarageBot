#include <cmath>
#include <cstdint>
#include <iostream>
#include <vector>

// Small native helper for media triage.
// It does not identify a person, perform face recognition, or prove AI generation.
// The JavaScript service can use a future native build to calculate low-level signals.

double normalized_entropy(const std::vector<uint8_t>& bytes) {
    if (bytes.empty()) return 0.0;
    double counts[256] = {};
    for (uint8_t b : bytes) counts[b] += 1.0;
    double h = 0.0;
    const double n = static_cast<double>(bytes.size());
    for (double c : counts) {
        if (c == 0.0) continue;
        const double p = c / n;
        h -= p * std::log2(p);
    }
    return h / 8.0;
}

int main() {
    std::vector<uint8_t> sample = {0, 12, 44, 128, 180, 200, 255, 44, 12, 128};
    std::cout << normalized_entropy(sample) << std::endl;
    return 0;
}
