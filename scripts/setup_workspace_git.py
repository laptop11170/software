import urllib.request
import zipfile
import os

git_dir = r"c:\Users\7yadi\Downloads\Software\git_bin"
zip_path = r"c:\Users\7yadi\Downloads\Software\git_bin.zip"

if not os.path.exists(os.path.join(git_dir, "cmd", "git.exe")):
    os.makedirs(git_dir, exist_ok=True)
    print("Downloading Portable MinGit zip into workspace...")
    url = "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"
    urllib.request.urlretrieve(url, zip_path)
    print("Extracting MinGit...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(git_dir)
    print("MinGit extracted successfully!")

git_exe = os.path.join(git_dir, "cmd", "git.exe")
print(f"Git executable ready at: {git_exe}")
