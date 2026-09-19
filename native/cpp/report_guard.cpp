#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cctype>

static bool allowed_public_field(const std::string& field) {
    static const std::vector<std::string> forbidden = {
        "ktp","kk","sim","student_card","face","face_photo",
        "identity_document","biometric"
    };
    std::string normalized = field;
    std::transform(normalized.begin(), normalized.end(), normalized.begin(),
        [](unsigned char c){ return static_cast<char>(std::tolower(c)); });
    return std::find(forbidden.begin(), forbidden.end(), normalized) == forbidden.end();
}

int main() {
    std::vector<std::string> fields = {
        "member_id","status","whatsapp","gmail","secure_evidence_ref"
    };
    for (const auto& field : fields) {
        std::cout << field << ": "
                  << (allowed_public_field(field) ? "ALLOWED" : "BLOCKED") << "\n";
    }
    std::cout << "PT NEXOVONARSACORPORATION - All Right Reserved\n";
    return 0;
}
