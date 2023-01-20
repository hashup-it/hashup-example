import * as React from "react"
import {
  Box,
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { GamesList } from "./components/GamesList"



export const App = () => (
    <ChakraProvider theme={theme}>
      <Box p="7vh 5vw" bg="#151515">
        <GamesList />
      </Box>
    </ChakraProvider>
)
