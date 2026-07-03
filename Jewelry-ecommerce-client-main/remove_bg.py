import os
from rembg import remove

input_path = r'C:\Users\Admin\.gemini\antigravity-ide\brain\2fd34a4a-7a25-4870-87d8-bf64fd70adc6\media__1782976609935.png'
output_path = r'Z:\Jewelry-ecommerce-client-main\public\assets\img\slider\4\slider-1.png'

print("Starting background removal...")
try:
    with open(input_path, 'rb') as i:
        input_data = i.read()
    
    # Remove the background
    output_data = remove(input_data)
    
    # Save the output image
    with open(output_path, 'wb') as o:
        o.write(output_data)
        
    print(f"Successfully processed and saved to {output_path}")
except Exception as e:
    print(f"Error: {e}")
