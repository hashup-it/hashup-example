import { Flex } from '@chakra-ui/react';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { GameDetails } from './GameDetails';

export const GamesList = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get('http://164.90.210.31/v1/tokens/polygon')
            .then((res: any) => {
                console.log(res.data);
                setGames(res.data);
            })
    }, [])

  return (
      <Flex flexDirection="column" gap="20px">{games!.map((game: any) => <GameDetails key={ game._id } game={game}/>)}</Flex>
  )
}
