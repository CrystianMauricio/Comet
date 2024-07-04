from PIL import Image

def white_to_transparency(img_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Calculate the intensity of the pixel's whiteness
        brightness = sum(item[:3]) / 3  # Average of R, G, B
        # Calculate new alpha based on brightness
        alpha = 255 - int(brightness)
        # Set color to black, adjust alpha based on original brightness
        newData.append((0, 0, 0, alpha))
    img.putdata(newData)
    return img

# Usage
img_path = '/Users/luka/Documents/Dev/Capri/cometapp/assets/white_noise_large.png'
result_img = white_to_transparency(img_path)
result_img.save('white_noise_transparent.png')

