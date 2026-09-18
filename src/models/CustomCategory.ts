export class CustomCategory {
  categoryId: number
  userId: number
  selected: boolean
  createdAt: Date

  constructor(
    categoryId: number,
    userId: number,
    selected: boolean = false,
    createdAt: Date = new Date()
  ) {
    this.categoryId = categoryId
    this.userId = userId
    this.selected = selected
    this.createdAt = createdAt
  }
}