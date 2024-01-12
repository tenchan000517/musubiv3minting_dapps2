import os

def list_files_and_folders(directory, exclude=[]):
    for root, dirs, files in os.walk(directory):
        # 除外リストに含まれるディレクトリを削除
        dirs[:] = [d for d in dirs if d not in exclude]
        
        for name in dirs:
            full_path = os.path.join(root, name)
            print(full_path)
            yield full_path
        for name in files:
            full_path = os.path.join(root, name)
            print(full_path)
            yield full_path

if __name__ == "__main__":
    directory = "C:\Musubi Collection by NinjaDAO\V1\Musubi_minting_dapp"
    exclude_list = ["node_modules"]  # 除外するディレクトリのリスト
    for _ in list_files_and_folders(directory, exclude_list):
        pass
