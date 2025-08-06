from PIL import Image

# Load image and convert to RGBA
img = Image.open("Salary.png").convert("RGBA")
data = img.getdata()

# Target color
target_color = (56,52,252)  # #885ABB with full alpha

# Replace all non-transparent pixels
new_data = [(target_color if pixel[3] != 0 else pixel) for pixel in data]

img.putdata(new_data)
img.save("Salary.png")
