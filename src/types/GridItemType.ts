

export type GridItemType = {
    item: number | null; //Pega o item pela posição na lista
    shown: boolean; //O item está sendo exibido? Sim ou Não
    permanentShown: boolean; // O item ficará sendo exibido? Sim ou Não
}