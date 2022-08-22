import { render, screen } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import PokemonCard from './components/PokemonCard';
const imgUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png';
let container;

beforeEach(() => {
  container = render(<PokemonCard name = 'pikachu' types = {['electric']} img = {imgUrl}/>, {wrapper: MemoryRouter});
  container = container.container;
})

describe('PokemonCard component: ', () => {
  it('Should render an <h2> element with the name sent by props.', () => {
    const h2 = container.getElementsByTagName('h2')[0].innerHTML;
    expect(h2).toEqual('Pikachu');
  })
  
  it('Should render an <img> element with the url sent by props.', () => {
    const img = container.getElementsByTagName('img')[0].src;
    expect(img).toEqual(imgUrl);
  })
  
  it('Should render an <h4> element with the types sent by props.', () => {
    const h4 = container.getElementsByTagName('h4')[0].innerHTML;
    expect(h4).toEqual('Tipos: Electric');
  })
  
  it('Should render a link that redirects to the detail view.', () => {
    const link = container.getElementsByTagName('a')[0].href;
    expect(link).toEqual('http://localhost/pokemonDetails/pikachu');
  })
})


