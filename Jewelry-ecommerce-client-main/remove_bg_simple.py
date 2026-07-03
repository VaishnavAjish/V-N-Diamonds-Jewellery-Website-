from PIL import Image

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
    remove_white_bg(r'C:\Users\Admin\.gemini\antigravity-ide\brain\2fd34a4a-7a25-4870-87d8-bf64fd70adc6\media__1782976609935.png', r'Z:\Jewelry-ecommerce-client-main\public\assets\img\slider\4\slider-1.png')
except Exception as e:
    print(f"Error: {e}")
