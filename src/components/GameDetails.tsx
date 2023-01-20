import { Button, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { usdAbi } from '../usdAbi'
import { storeAbi } from '../storeAbi'

export const GameDetails = ({ game }: { game: any }) => {
    const [stage, setStage] = useState(0)
    const [signer, setSigner] = useState<any>();
    const [approveLoading, setApproveLoading] = useState<boolean>(false)
    const [buyLoading, setBuyLoading] = useState<boolean>(false)

    const [referrer, setReferrer] = useState(ethers.constants.AddressZero)
    //can be taken from the form
    //1 is 0.01 token so you must pass e.g. 700 to buy 7 tokens
    const [ammount, setAmmount] = useState(100);

    useEffect(() => {
        const authorize = async () => {
            const ethereum = (window as any).ethereum;
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            const provider = new ethers.providers.Web3Provider(ethereum)
            const walletAddress = accounts[0]    // first account in MetaMask
            const signer = provider.getSigner(walletAddress)
            setSigner(signer);
        }

        authorize();
    }, [])
    
    const addTokenToMetamask = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number, tokenImage: string) => {        
        try {
            await (window as any).ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                type: 'ERC20',
                options: {
                    address: tokenAddress,
                    symbol: tokenSymbol,
                    decimals: tokenDecimals,
                    image: tokenImage,
                },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    
    const approveHandler = async (price: number) => {
        setApproveLoading(true);
        const usdContract = new ethers.Contract("0x2791bca1f2de4661ed88a30c99a7a9449aa84174", usdAbi, signer)
        console.log(usdContract)
        const approve = await usdContract.approve("0x1aFb90451aBbF5Eb6f59842CAF8949374F1B4683", price * ammount)
        await approve.wait();
        setApproveLoading(false);
        setStage(1);
    }

    const buyHandler = async (gameAddress: string) => {
        setBuyLoading(true);
        const storeContract = new ethers.Contract("0x1aFb90451aBbF5Eb6f59842CAF8949374F1B4683", storeAbi, signer)
        const buy = await storeContract.buyLicense(gameAddress, ammount, "0x714EF5c429ce9bDD0cAC3631D30474bd04e954Dc", referrer)
        await buy.wait();
        setBuyLoading(false);
        setStage(0);
        alert("You have successfully purchased 1 copy of the game")
        addTokenToMetamask(gameAddress, game.symbol, 2, "")
    }

    return (
      <Flex background='rgba(100, 100, 100, 0.3)' boxShadow="0 8px 32px 0 #ff3f3f22" backdropFilter="blur(10.5px)" p="15px 20px" borderRadius="25px" justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column" gap="10px">
              <Flex gap="25px" alignItems="center">
                  <Text fontSize="25px" fontWeight="700">{game.name} </Text>
                  <Flex fontSize="18px" fontWeight="600" p="5px 10px" bg="rgba(0, 0, 0, 0.6)" borderRadius="25px">{game.symbol}</Flex>
              </Flex>
              <Text fontSize="18px" color="rgba(255, 255, 255, 0.7)">Creator: {game.creator.slice(0, 10)}...</Text>
          </Flex>
          <Flex alignItems="center" gap="20px">
              <Text fontSize="22px" fontWeight="600">${game.price / 10000}</Text>
              {stage === 0 ?
                    <Button p="15px" bg="#ff3f3f" onClick={() => approveHandler(game.price)}>{approveLoading ? <Spinner /> : 'APPROVE'}</Button> :
                  <Button p="15px" bg="#ff3f3f" onClick={() => buyHandler(game.address)}>{buyLoading ? <Spinner /> : 'BUY'}</Button>
              }
          </Flex>
      </Flex>
  )
}
