import {it, expect} from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { initStore } from '../../src/client/store'
import { Catalog } from '../../src/client/pages/Catalog'
import { CartApi } from '../../src/client/api'
import React from "react";
import { productsLoaded } from '../../src/client/store'
import { CartState, CheckoutFormData, Product, ProductShortInfo } from '../../src/common/types'
import { ProductItem } from '../../src/client/components/ProductItem'
import { ProductDetails } from '../../src/client/components/ProductDetails'

const basename = '/hw/store';
const cart = new CartApi();


export class ExampleApi {
  constructor(private readonly basename: string) {

  }

  async getProducts(): Promise<{data: ProductShortInfo[]}> {
      return Promise.resolve({
        data: [
          {id: 0, name: 'Sleek Bike', price: 781 },
          {id: 1, name: 'Intelligent mouse', price: 881 }
        ]
      })
  }

  async getProductById(id: number): Promise<{data: Product}> {
      return Promise.resolve({
        data: {
          id: 0,
          name: 'Sleek Bike',
          price: 781,
          color: 'cyan',
          material: 'Rubber',
          description: 'test',
        }
      })
  }

  async checkout(form: CheckoutFormData, cart: CartState) {
  }
}

const api = new ExampleApi(basename)
/* @ts-ignore */
const store = initStore(api, cart);

it ('Проверка полученных товаров в каталоге', async () => {
    const products = await api.getProducts()
    
    store.dispatch(productsLoaded(products.data))
    
    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
            <Catalog />
        </Provider>
      </BrowserRouter>
    )

    const {container, getByText, getAllByTestId, getByTestId} = render(application)
    
    expect(getByText('LOADING')).toBeDefined()
    
    
    await waitFor(() => { expect(getAllByTestId(/[0-1]/i)).toBeDefined()})
})

it('проверка названия, цены и ссылки на инфо', async () => {
  const products = await api.getProducts()
    
  store.dispatch(productsLoaded(products.data))

  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
      {products.data.map(p => (
        <ProductItem product={p} />
      ))}
      </Provider>
    </BrowserRouter>
  )
  const {container} = render(application)

expect(container.querySelector('.card-title')?.textContent).toBeDefined()
expect(container.querySelector('.card-text')?.textContent).toBeDefined()
expect(container.querySelector('.card-link')?.getAttribute('href')).toBe('/hw/store/catalog/0')
})

it('На странице с инфо есть название, цена, материал, цвет, кнопка добавления в корзину', async () => {
  const product = await api.getProductById(0)
    console.log(product);
    
  // store.dispatch(productsLoaded(products.data))

  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
      
        <ProductDetails product={product.data} />
      
      </Provider>
    </BrowserRouter>
  )

  const { container } = render(application)
 
  expect(container.querySelector('.ProductDetails-Name')?.textContent).toBeDefined()
  expect(container.querySelector('.ProductDetails-Description')?.textContent).toBeDefined()
  expect(container.querySelector('.ProductDetails-Price')?.textContent).toBeDefined()
  expect(container.querySelector('.ProductDetails-Color')?.textContent).toBeDefined()
  expect(container.querySelector('.ProductDetails-Material')?.textContent).toBeDefined()

}) 