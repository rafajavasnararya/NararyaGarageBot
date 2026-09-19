# Native C++

The project includes a small C++ media-signature helper.

Purpose:
- calculate low-level byte entropy for media triage;
- provide a native extension point for future image-forensics features;
- never make a definitive claim that an image is AI-generated;
- never perform face recognition or biometric identification.

Build:

cmake -S native/cpp -B native/cpp/build
cmake --build native/cpp/build
