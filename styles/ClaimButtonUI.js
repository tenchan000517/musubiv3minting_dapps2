import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as s from './globalStyles';
import * as customStyles from './ClaimButtonStyles';
import CONFIG from '../config/config.json';
import handleWalletConnection from '../utils/handleWalletConnection';



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const ClaimButtonUI = ({
  data,
  claimingNft,
  mintAmount,
  adjustMintAmount,
  handleWalletConnection,
  connectFunc,
  claimNFTs,
  blockchain
}) => {
    console.log("ClaimButtonUI props:", {
        data,
        claimingNft,
        mintAmount,
        adjustMintAmount,
        handleWalletConnection,
        connectFunc,
        claimNFTs,
        blockchain

    });
  
  console.log("Data content:", data);
  console.log("Blockchain content:", blockchain);

  const dispatch = useDispatch();

  const [allowlistUserAmountData] = useState(0); // setAllowlistUserAmountData が未使用なので、ここではコメントアウトしています

  // data の存在を確認する
  if (!data) {
    console.error("Data is not available!");
    return <div>Error: Data is not available!</div>;
  }

  // totalSupply の存在を確認する
  if (typeof data.totalSupply === "undefined") {
    console.error("totalSupply is not available in data!");
    return <div>Error: totalSupply is not available!</div>;
  }

  // userMintedAmount の存在を確認する
  if (typeof data.userMintedAmount === "undefined") {
    console.error("userMintedAmount is not available in data!");
    return <div>Error: userMintedAmount is not available!</div>;
  }

  const isSaleEnded = Number(data.totalSupply) >= CONFIG.MAX_SUPPLY;
  const isConnected = blockchain.account !== "" && blockchain.smartContract !== null;

  const renderMintMessage = () => {
    if (data.loading) return "読み込み中です。しばらくお待ちください。";
    if (data.paused) {
      if (data.onlyAllowlisted) {
        if (allowlistUserAmountData === 0) return "現在ミントは停止中です。接続したウォレットはアローリストに登録されていません。";
        if (data.mintCount && (allowlistUserAmountData - data.userMintedAmount) <= 0) return "現在ミントは停止中です。ミントの上限に達しました。";
        return "現在ミントは停止中です。";
      }
      return "現在ミントは停止中です。";
    }
    // ミントボタンの追加

    // アローリストに登録されていません等
  };


  return (
    <s.Screen>
      <customStyles.ContainerWithBackground
        flex={1}
        ai={"center"}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <customStyles.StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        <customStyles.ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <customStyles.CenteredContainer flex={1}>
            <customStyles.StyledImg alt={"example"} src={"/config/images/left.png"} />
          </customStyles.CenteredContainer>
          <s.SpacerLarge />
          <customStyles.AccentContainer flex={2}>
            <customStyles.CenteredTextTitle>
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </customStyles.CenteredTextTitle>
            <customStyles.CenteredTextDescription>
              <customStyles.StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </customStyles.StyledLink>
            </customStyles.CenteredTextDescription>
            <s.SpacerSmall />
            {isConnected ? (
          <button onClick={claimNFTs}>
            {claimingNft ? "ミント中..." : `ミント ${mintAmount} NFT`}
          </button>
        ) : (
            <button onClick={() => handleWalletConnection(dispatch)}>Connect Wallet</button>


        )}
            {isSaleEnded ? (
              <>
                <customStyles.CenteredTextTitle>
                  The sale has ended.
                </customStyles.CenteredTextTitle>
                <customStyles.CenteredTextDescription>
                  You can still find {CONFIG.NFT_NAME} on
                </customStyles.CenteredTextDescription>
                <s.SpacerSmall />
                <customStyles.StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </customStyles.StyledLink>
              </>
            ) : (
              <>
                <customStyles.CenteredTextDescription>
                  {renderMintMessage()}
                </customStyles.CenteredTextDescription>
                {/* ミントボタンの追加 */}
                <button onClick={claimNFTs}>
                  {claimingNft ? "ミント中..." : `ミント ${mintAmount} NFT`}
                </button>
              </>
            )}
          </customStyles.AccentContainer>
          <s.SpacerLarge />
          <customStyles.CenteredContainer flex={1}>
            <customStyles.StyledImg alt={"example"} src={"/config/images/right.png"} />
          </customStyles.CenteredContainer>
        </customStyles.ResponsiveWrapper>
        <s.SpacerMedium />
        <customStyles.CenteredContainer jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <customStyles.CenteredTextDescription>
            正しいネットワークに接続されているか確認してください (
            {CONFIG.NETWORK.NAME} Mainnet) 。何度も購入ボタンを押すとその度に購入されますのでご注意ください。
          </customStyles.CenteredTextDescription>
          <s.SpacerSmall />
          <customStyles.CenteredTextDescription>
            ガス代が低すぎると失敗することがあります。適切なガス代を設定してください。
          </customStyles.CenteredTextDescription>
        </customStyles.CenteredContainer>
      </customStyles.ContainerWithBackground>
    </s.Screen>
  );
  
};

export default ClaimButtonUI;

