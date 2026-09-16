import kagglehub

print("Starting Paddy Disease Classification download...")

path = kagglehub.competition_download(
    "paddy-disease-classification",
    output_dir=r"D:\SIH agri\dataset\paddy_train"
)

print()
print("DOWNLOAD COMPLETE")
print("Dataset path:")
print(path)