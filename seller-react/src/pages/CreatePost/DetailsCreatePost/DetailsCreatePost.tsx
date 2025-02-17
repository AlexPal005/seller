import { IoIosArrowDown } from "react-icons/io"
import React, { createContext, useContext, useEffect, useState } from "react"
import { CategoriesPopUp } from "./CategoriesPopUp.tsx"
import { PostContext } from "../CreatePost/CreatePost.tsx"
import {
  Category,
  getAllCategories,
  useGetAllCategories,
} from "../../../query/category.ts"

type DetailsCreatePostProps = {
  categoryId: number
  errorProductName: string
  errorCategory: string
}
type DetailsCreatePostContextType = {
  categories: Category[]
  closeModal: () => void
  setMainCategoryId: React.Dispatch<React.SetStateAction<number>>
  mainCategoryId: number
}
const DetailsCreatePostContextDefault = {
  categories: [],
  closeModal: () => {
    console.log("The window is closed!")
  },
  setMainCategoryId: () => {},
  mainCategoryId: -1,
}
export const DetailsCreatePostContext =
  createContext<DetailsCreatePostContextType>(DetailsCreatePostContextDefault)
export const DetailsCreatePost = ({
  categoryId,
  errorProductName,
  errorCategory,
}: DetailsCreatePostProps) => {
  const [isClickedCategories, setIsClickedCategories] = useState(false)
  const { data: categories } = useGetAllCategories()
  const { setProductToCreate, setErrors, productToCreate } =
    useContext(PostContext)
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>()
  const [mainCategoryId, setMainCategoryId] = useState(-1)

  useEffect(() => {
    if (categoryId !== -1) {
      const foundCategory = categories?.find(
        (category) => category.id === categoryId,
      )
      if (foundCategory) {
        setCurrentCategory(foundCategory)
      }
    }
  }, [categoryId, categories])

  const onChangeProductName = (e: { target: { value: string } }) => {
    const productName = e.target.value
    setProductToCreate((prevProduct) => ({
      ...prevProduct,
      productName: productName,
    }))
    if (e.target.value.length < 16) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productName: "Заголовок надто короткий. Додайте більше деталей!",
      }))
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "" }))
    }
  }

  const onClickSelectCategories = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsClickedCategories(true)
  }

  const closeModal = () => {
    setIsClickedCategories(false)
  }

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  return (
    <DetailsCreatePostContext.Provider
      value={{
        categories: categories || [],
        closeModal,
        setMainCategoryId,
        mainCategoryId,
      }}
    >
      <div className="create-post-details white-block" id="create-post-details">
        <h4>Деталі оголошення</h4>
        <form>
          <div className="create-post-container__wrapper">
            <p className="blue-text-16">Вкажіть назву</p>
            <input
              id="product-name"
              className="create-post-details__name"
              type="text"
              placeholder="Наприклад, xiaomi redmi note 9 pro"
              onChange={onChangeProductName}
              value={productToCreate.productName}
            />
            {errorProductName && <p className="error">{errorProductName}</p>}
          </div>
          <div className="create-post-container__wrapper">
            <p className="blue-text-16">Категорія</p>
            <button
              className="create-post-details__category-button"
              onClick={onClickSelectCategories}
            >
              {!currentCategory ? (
                <span>Виберіть категорію</span>
              ) : (
                <span>{currentCategory.name}</span>
              )}
              <IoIosArrowDown className="icon-arrow" />
            </button>
            {errorCategory && <p className="error">{errorCategory}</p>}
          </div>
        </form>
        {isClickedCategories && <CategoriesPopUp closeModal={closeModal} />}
      </div>
    </DetailsCreatePostContext.Provider>
  )
}
