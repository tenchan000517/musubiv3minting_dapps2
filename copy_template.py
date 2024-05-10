import shutil

#https://eth-converter.com/

contractAddress = "0xf083F9bc026DaFC7E5AFeab5CB576f9464c5553A"

# chainSelect = "Ethereum"
# chainSelect = "Goerli"
chainSelect = "Polygon"

NFTName = "TEST404"
symbol = "TEST404"
maxSupply = "2322"
weiCost = "0"
displayCost = "0"
marketplaceLink = "https://opensea.io/ja/collection/musubicollection"
singleMintMode = "false"
creditCardMode = "true"
paymentUrl = "https://paypiement.xyz/ja/projects/0e483200-a017-4961-9bce-457f2da1cdc8?recipient"
termsOfUseMode = "true"
termsOfUseLink = "https://nft-mint.xyz/paidpost-terms/"
termsOfUseDisplay = "利用規約・プライバシーポリシー・特定商取引法に基づく表記"

metaTitle = "Kurimaro Collection"
metaDescription = "Kurimaro Collection MINT"
metaUrl = "https://ikimono.nft-mint.xyz/"
headerLogoAlt = "kurimaro logo"
headerTitle = "kurimaro collection"

###############################################

if chainSelect == "Ethereum" :
    chainNumber = "1"
    chainName = "Ethereum"
    chainSymbol = "ETH"
    scanAddress = "https://etherscan.io/token/" + contractAddress

elif chainSelect == "Goerli" :
    chainNumber = "5"
    chainName = "Ethereum"
    chainSymbol = "ETH"
    scanAddress = "https://goerli.etherscan.io/token/" + contractAddress

elif chainSelect == "Polygon" :
    chainNumber = "137"
    chainName = "Polygon"
    chainSymbol = "MATIC"
    scanAddress = "https://polygonscan.com/token/" + contractAddress


#image copy
shutil.copy2("1x/bg.png"    , "public/config/images/bg.png")
shutil.copy2("1x/left.png"  , "public/config/images/left.png")
shutil.copy2("1x/right.png" , "public/config/images/right.png")
shutil.copy2("1x/logo.png"  , "public/config/images/logo.png")
shutil.copy2("1x/logo192.png" , "public/logo192.png")
shutil.copy2("1x/logo512.png" , "public/logo512.png")
shutil.copy2("1x/favicon.png" , "public/favicon.ico")

shutil.copy2("1x/navi1.png", "public/navi1.png")
shutil.copy2("1x/navi2.png", "public/navi2.png")
shutil.copy2("1x/navi3.png", "public/navi3.png")
shutil.copy2("1x/navi4.png", "public/navi4.png")


#abi copy
shutil.copy2("copy_template/abi.json" , "public/config/abi.json")
shutil.copy2("copy_template/ERC721abi.json" , "public/config/ERC721abi.json")
shutil.copy2("copy_template/ERC1155abi.json" , "public/config/ERC1155abi.json")


#config.json
with open("copy_template/config.json", encoding="utf-8") as f:
    data_lines = f.read()
    
data_lines = data_lines.replace("_PAYMENT_URL_", paymentUrl)
data_lines = data_lines.replace("_CONTRACT_ADDRESS_", contractAddress)
data_lines = data_lines.replace("_SCAN_ADDRESS_", scanAddress)
data_lines = data_lines.replace("_USE_ABI_", "ERC721")
data_lines = data_lines.replace("_CHAIN_NAME_", chainName)
data_lines = data_lines.replace("_CHAIN_SYMBOL_", chainSymbol)
data_lines = data_lines.replace("_CHAIN_NUMBER_", chainNumber)
data_lines = data_lines.replace("_NFT_NAME_", NFTName)
data_lines = data_lines.replace("_SYMBOL_", symbol)
data_lines = data_lines.replace("_MAX_SUPPLY_", maxSupply)
data_lines = data_lines.replace("_WEI_COST_", weiCost)
data_lines = data_lines.replace("_DISPLAY_COST_", displayCost)
data_lines = data_lines.replace("_MARKETPLACE_LINK_", marketplaceLink)
data_lines = data_lines.replace("_SINGLE_MINT_MODE_", singleMintMode)
data_lines = data_lines.replace("_CREDIT_CARD_MODE_", creditCardMode)
data_lines = data_lines.replace("_CREDIT_CARD_LINK_", paymentUrl)
data_lines = data_lines.replace("_TERMS_OF_USE_MODE_", termsOfUseMode)
data_lines = data_lines.replace("_TERMS_OF_USE_LINK_", termsOfUseLink)
data_lines = data_lines.replace("_TERMS_OF_USE_DISPLAY_", termsOfUseDisplay)
data_lines = data_lines.replace("_META_TITLE_", metaTitle)
data_lines = data_lines.replace("_META_DESCRIPTION_", metaDescription)
data_lines = data_lines.replace("_META_URL_", metaUrl)
data_lines = data_lines.replace("_HEADER_LOGO_ALT_", headerLogoAlt)
data_lines = data_lines.replace("_HEADER_TITLE_", headerTitle)

with open("public/config/config.json", mode="w", encoding="utf-8") as f:
    f.write(data_lines)


#index.html
with open("copy_template/index.html", encoding="utf-8") as f:
    data_lines = f.read()
    
data_lines = data_lines.replace("_NFT_NAME_", NFTName)

with open("public/index.html", mode="w", encoding="utf-8") as f:
    f.write(data_lines)


#manifest.json
with open("copy_template/manifest.json", encoding="utf-8") as f:
    data_lines = f.read()
    
data_lines = data_lines.replace("_NFT_NAME_", NFTName)
data_lines = data_lines.replace("_SYMBOL_", symbol)

with open("public/manifest.json", mode="w", encoding="utf-8") as f:
    f.write(data_lines)