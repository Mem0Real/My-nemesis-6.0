
model Categories {
  id            String           @id
  name          String        
  description   String?
  image         String?
  parents       Parents[]
  children      Children[]
  items         Items[]
}

model Parents {
  id            String           @id 
  name          String        
  description   String?
  image         String?
  
  category      Categories    @relation(fields: [CategoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  CategoryId    String
  
  children      Children[]
  items         Items[]
}

model Children {
  id            String           @id
  name          String        
  description   String?
  image         String?
  
  category      Categories    @relation(fields: [CategoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  parent        Parents       @relation(fields: [ParentId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  CategoryId    String
  ParentId      String

  items         Items[]
}

model Items {
  id            String           @id
  name          String        
  description   String?
  brand         String?
  model         String?
  quantity      Int?
  price         Float?
  images        String[]

  child         Children         @relation(fields: [ChildId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  parent        Parents          @relation(fields: [ParentId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  category      Categories       @relation(fields: [CategoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  ChildId       String
  ParentId      String
  CategoryId    String
}

model Customers {
  id                      String           @id
  name                    String
  phone                   Int
  totalPurchase           Float
  delivered               Boolean             @default(false)

  order                   Orders[]

  createdAt               DateTime            @default(now())
  updatedAt               DateTime            @updatedAt
} 

model Orders {
  id                      Int                 @id @default(autoincrement())
  productId               String
  productName             String
  orderedQuantity         Int
  productPrice            Float            
  delivered               Boolean             @default(false)
  
  product                 Customers           @relation(fields: [customerId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  customerId              String
}

model User {
  id       String @id @default(uuid())
  email    String @unique
  password String
  name     String?
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
