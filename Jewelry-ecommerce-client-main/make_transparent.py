from PIL import Image
import os

def remove_white_bg(input_path, output_path, threshold=235):
    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        # Check if the pixel is close to white
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Change to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

try:
    input_file = r'Z:\Jewelry-ecommerce-client-main\public\assets\img\slider\4\slider-1.png'
    output_file = r'Z:\Jewelry-ecommerce-client-main\public\assets\img\slider\4\slider-1_transparent.png'
    remove_white_bg(input_file, output_file)
    
    # Replace the original with the transparent one
    os.replace(output_file, input_file)
    print("Successfully replaced the banner image with the transparent version!")
except Exception as e:
    print(f"Error: {e}")
