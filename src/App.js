import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import iota_bot_img from "./assets/images/Game.png";
import ClipLoader from "react-spinners/ClipLoader";
import { nft } from "./config";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 400px;
  height: 400px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledNFT = styled.img`
  width: 400px;
  height: 400px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day.");
  const [claimingNft, setClaimingNft] = useState(false);


  const claimNFTs = (_amount) => {


    console.log("_amount", _amount)

    if (_amount < 0) {
      return;
    }
    setFeedback("Minting your NFT...");
    setClaimingNft(true);
    console.log("nft.address", nft.address)
    blockchain.smartContract.methods
      .mint(blockchain.account)
      .send({
        gasLimit: "285000",
        to: nft.address,
        from: blockchain.account,
        // value: blockchain.web3.utils.toWei((100 * _amount).toString(), "ether"),
        value: blockchain.web3.utils.toWei("0", "ether"),
      })
      .once("error", (err) => {
        console.log("error1")
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log("error2")
        setFeedback(
          "WOW, you now own a NFT. Congratulations :-)"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    try {
      getData();

      console.lgg("data", data.paused)

    } catch (error) {
      console.log("error useEffect")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain.account]);


  let sold_out = false;

  return (
    <s.Screen style={{ backgroundColor: "var(--primary)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>

        <s.SpacerMedium />

        {sold_out ? (
          <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <s.TextTitle
                style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}
              >
                Sorry - We're sold out!
              </s.TextTitle>
              <s.SpacerMedium />
              <s.TextTitle style={{ textAlign: "center" }}>
                Next drop? <a target="_blank" rel="noreferrer" href="https://twitter.com/iotabots">@iotabots</a>
              </s.TextTitle>
              <video width="50%" id="soonbot_video" autoplay>
                <source src="./assets/Soonbot.mp4" type="video/mp4" />
              </video>
            </s.Container>
          </ResponsiveWrapper>
        ) : (
          <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg alt={"example"} src={iota_bot_img} />
              <s.SpacerMedium />
              <s.TextTitle
                style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}
              >
                Mint {nft.name} now!
              </s.TextTitle>
              <s.SpacerMedium />
              <s.TextTitle
                style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }}
              >
                {data.totalSupply ? `${parseInt(data.totalSupply)} / 1000` : ""}
              </s.TextTitle>
            </s.Container>
            <s.SpacerMedium />
            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{ backgroundColor: "#383838", padding: 24 }}
            >

              {data.paused ? (
                 <>
                 <s.TextTitle style={{ textAlign: "center" }}>
                   Sorry - the sale has not started yet.
                 </s.TextTitle>
                 <s.SpacerSmall />
               </>
              ) : (
                <>
                  {Number(data.totalSupply) === 1000 ? (
                    <>
                      <s.TextTitle style={{ textAlign: "center" }}>
                        Sorry - the sale has ended.
                      </s.TextTitle>
                      <s.SpacerSmall />
                    </>
                  ) : (
                    <>
                      <s.TextTitle style={{ textAlign: "center" }}>
                        1 {nft.symbol} costs {nft.price} MIOTA.
                      </s.TextTitle>
                      <s.SpacerMedium />
                      <s.TextDescription style={{ textAlign: "center" }}>
                        No gas fees.
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <s.TextDescription style={{ textAlign: "center" }}>
                        One free {nft.symbol} for each user.
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <s.TextDescription style={{ textAlign: "center" }}>
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      {blockchain.account === "" ||
                        blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>
                          <s.TextDescription style={{ textAlign: "center" }}>
                            Connect to the IOTA EVM Testnet network
                          </s.TextDescription>
                          <s.SpacerSmall />
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            CONNECT
                          </StyledButton>
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <s.TextDescription style={{ textAlign: "center" }}>
                                {blockchain.errorMsg}
                              </s.TextDescription>
                            </>
                          ) : null}
                        </s.Container>
                      ) : (
                        <s.Container ai={"center"} jc={"center"} fd={"column"}>


                          <ClipLoader color="#02c692" loading={claimingNft} size={50} />
                          <s.SpacerMedium />
                          <StyledButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs(1);
                              getData();
                            }}
                          >
                            {claimingNft ? "BUSY" : "GET A NFT"}
                          </StyledButton>

                        </s.Container>
                      )}
                    </>
                  )}
                </>
              )}
            </s.Container>
          </ResponsiveWrapper>
        )}
        <s.SpacerSmall />

        <s.Container jc={"center"} ai={"center"}>
          <s.TextTitle style={{ textAlign: "center" }}>
            Your {nft.name}
          </s.TextTitle>
          <s.SpacerSmall />
          <s.SpacerSmall />
          {data.nfts.length ? (
            <>
              <s.SpacerSmall />

              <s.TextDescription style={{ textAlign: "center" }}>
                {
                  data.nfts.map((_nft, i) => (
                    <s.Card>
                      <s.TextDescription style={{ textAlign: "center", fontSize: 16 }}>
                        SPACEBOTS #{_nft}
                      </s.TextDescription>
                      <br />
                      <s.TextTitle style={{ textAlign: "center" }}>
                        <a rel="noreferrer" target="_blank" href="https://gateway.pinata.cloud/ipfs/QmQmh7VbmQ4S6D6qmrBHyvVQY6TF14nu9Y8QbfjJmbUpE1/">Play</a>
                      </s.TextTitle>
                      <StyledNFT class src={iota_bot_img}></StyledNFT>
                    </s.Card>
                  ))
                }
              </s.TextDescription>
            </>
          ) : (
            <s.TextDescription style={{ textAlign: "center", fontSize: 14 }}>
              You dont have any {nft.name} yet :-(
            </s.TextDescription>
          )

          }

        </s.Container>

        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
            Please make sure you are connected to the right network (<a target="_blank" rel="noreferrer" href="https://wiki.iota.org/wasp/guide/chains_and_nodes/testnet#interact-with-evm">IOTA EVM Testnet</a>) and the correct address. Please note: The Tesnet reset sometimes (after software updates) - unfortunately, your NFT will be lost. That's why we can't wait for the mainnet!
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
