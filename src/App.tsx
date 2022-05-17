import * as C from './App.styles';
import logoImg from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { Button } from './components/Button';
import {InfoItem} from './components/InfoItem';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items'
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {

  const [playing, setPlaying] = useState<boolean>(false); //O jogo tá rolando? Sim ou Não
  const [timeElapsed, setTimeElapsed] = useState<number>(0); //O tempo que o jogo tá rolando.
  const [moveCount, setMoveCount] = useState<number>(0); //Quantidade de movimentos que foram feitos
  const [shownCount, setShownCount] = useState<number>(0); //Quantas cartas estão sendo exibidas?
  const [gridItems, setGridItems] = useState<GridItemType[]>([]); //É um array que configura as ações das cartas.

  useEffect(() => {
    resetAndCreateGrid();
  }, []);

  useEffect(() => {
    const timer = setInterval(() =>{  
      if(playing === true) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);

    return () => clearInterval(timer);

  }, [playing, timeElapsed]);

  // Verificar se os abertos são iguais
  useEffect(() => {
    if(shownCount === 2) {
      //filter filtra os items selecionados / Cria um array em opened com os dois itens iguais pos0 e pos1
      let opened = gridItems.filter(item => item.shown === true);

      if(opened.length === 2) {
        
        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown === true) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          
        setGridItems(tmpGrid);
        setShownCount(0);
        } else {
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }
        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect(() => {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems])

  const resetAndCreateGrid = () => {
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      });
    }
    // Step 2.2 - preencher o grid
    for(let w = 0; w < 2; w++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length*2));
        }
        tmpGrid[pos].item = i;
      }
    }
    
    // Step 2.3 - jogar no state
    setGridItems(tmpGrid);

    // Step 3 - começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing === true && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    } 

  }

  return (
    <C.Container>
      <C.Info>
        <C.logoLink href="">
          <img src={logoImg} width="200" alt="" />
        </C.logoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
        </C.InfoArea>
        
        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item,index)=>(
            <GridItem 
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;