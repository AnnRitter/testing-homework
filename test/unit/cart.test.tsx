import {it, expect} from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {initStore} from '../../src/client/store'
import {Application} from '../../src/client/Application'
import { CartApi, ExampleApi } from '../../src/client/api';
import React from "react";
import * as reduxHooks from 'react-redux'
import { addToCart } from '../../src/client/store';



jest.mock('react-redux')

const mockedDispatch = jest.spyOn(reduxHooks, 'useDispatch')

it('Проверка количества элементов рядом с корзиной в шапке', () => {
  const basename = '/hw/store';

  const api = new ExampleApi(basename);
  let cart = new CartApi();
  const store = initStore(api, cart);

  const initialState = {
    cart: {},
    latestOrderName: undefined,
  };

  const product = {
    id: 1,
    name: 'Product 1',
    price: 10,
  };

  const action = addToCart(product)

  const newState = cart(initialState, action)

  expect(newState.cart[product.id]).toEqual({
    name: product.name,
    count: 1,
    price: product.price,
  })

  const application = (
    <BrowserRouter basename={basename}>
        <Provider store={store}>
            <Application />
        </Provider>
    </BrowserRouter>
  );

  console.log(store.getState().cart)

  const {container, getByTestId} = render(application)

  expect(Object.keys(store.getState().cart).length).toBe(1)
}












  // useSelector(cart).mockReturnValue({
  //   2: {
  //             name: 'test',
  //             price: 123,
  //             count: 5,
  //           }
  // })

  

//  store.getState().cart = {
//   2: {
//     name: 'test',
//     price: 123,
//     count: 5,
//   }
// }


  

  // let element = getByTestId('cartLabel')
  // console.log(element.textContent);
 
  
// })
