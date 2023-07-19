import prisma from "@/lib/prisma";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile, unlink } from "fs/promises";
import fs from "fs";
import { toast } from "react-hot-toast";

import { revalidatePath, revalidateTag } from "next/cache";

export async function create(formData) {
  "use server";

  let file = formData.get("image");
  let entry = formData.get("entry");

  if (!entry) entry = "categories";

  let categoryId = formData.get("categories");
  let parentId = formData.get("parents");
  let childId = formData.get("children");
  let name = formData.get("name");

  let brand = formData.get("brand");
  let model = formData.get("model");
  let quantity = formData.get("quantity");
  let price = formData.get("price");

  let id = formData.get("id");
  let description = formData.get("description");
  let image = formData.get("image");

  let category = { name: undefined, val: undefined };

  if (!id) {
    let idName = name.toLowerCase();
    let array = idName.split(/ and| &|, /);
    idName = array[0];
    idName = idName.replace(/\s/g, "-");
    formData.set("id", idName);
    id = formData.get("id");
  }

  if (childId !== null) {
    category = { name: "ChildId", val: childId };
  } else if (parentId !== null) {
    category = { name: "ParentId", val: parentId };
  } else if (categoryId !== null) {
    category = { name: "CategoryId", val: categoryId };
  }

  const writeToDb = async (dir = null) => {
    if (entry !== "items") {
      try {
        const res = await prisma[entry].create({
          data: {
            id: id,
            name: name,
            brand: brand ? brand : undefined,
            model: model ? model : undefined,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            price: price ? parseFloat(price) : undefined,
            description: description ? description : undefined,
            image: image ? image : undefined,
            [category.name]: category.val,
          },
        });
        return { success: "Item created successfully!" };
      } catch (error) {
        return { error: ("Error creating item. Error code: ", error) };
      }
    } else {
      try {
        const res = await prisma[entry].create({
          data: {
            id: id,
            name: name,
            brand: brand ? brand : undefined,
            model: model ? model : undefined,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            price: price ? parseFloat(price) : undefined,
            description: description ? description : undefined,
            images: dir ? dir : undefined,
            [category.name]: category.val,
          },
        });
        return { success: "Item created successfully!" };
      } catch (error) {
        return { error: ("Error creating item. Error code: ", error) };
      }
    }
  };
  if (!file) {
    const query = await writeToDb();
    if (query?.error) return { error: `Error creating item: ${query.error}` };
    else {
      revalidatePath("/collection");
      revalidatePath("/dashboard");
      revalidateTag("search");
      return { success: `Created Successfully!` };
    }
  } else {
    let relativeUploadDir;
    if (process.env.NODE_ENV === "development") {
      if (entry !== "items") {
        relativeUploadDir = `/uploads/${entry}/${category.val}`;
      } else relativeUploadDir = `/uploads/${entry}/${category.val}/${id}`;
    } else {
      if (entry !== "items") {
        relativeUploadDir = `/uploads/${entry}/${category.val}`;
      } else relativeUploadDir = `/uploads/${entry}/${category.val}/${id}`;
    }

    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
      const upload = await stat(uploadDir);
    } catch (e) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(
          "Error while trying to create directory when uploading a file\n",
          e
        );
      }
    }
    if (upload?.error) {
      return {
        error: `Error while trying to create directory for file upload \n
          ${error}`,
      };
    }

    if (entry !== "items") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
      const wtf = await writeFile(`${uploadDir}/${filename}`, buffer);

      if (wtf?.error) {
        return {
          error: `Error creating directory for file upload: ${wtf.error}`,
        };
      }
      let imageUrl = `${relativeUploadDir}/${filename}`;

      const query = await writeToDb(imageUrl);
      if (query?.error) return { error: `Error creating item \n ${error}` };
      else {
        revalidatePath("/collection");
        revalidatePath("/dashboard");
        revalidateTag("search");
        return { success: `Created Successfully!` };
      }
    } else {
      const formDataEntryValues = Array.from(formData.values());
      let imageUrl = [];
      for (const formDataEntryValue of formDataEntryValues) {
        if (
          typeof formDataEntryValue === "object" &&
          "arrayBuffer" in formDataEntryValue
        ) {
          const file = formDataEntryValue;
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(`${uploadDir}/${file.name}`, buffer);
          imageUrl.push(`${relativeUploadDir}/${file.name}`);
        }
      }
      const query = await writeToDb(imageUrl);
      if (query?.error) return { error: `Error creating item \n ${error}` };
      else {
        revalidatePath("/collection");
        revalidatePath("/dashboard");
        revalidateTag("search");
        return { success: `Created Successfully!` };
      }
    }
  }
}

export async function update(formData) {
  "use server";

  let file = formData.get("newImage");
  let entry = formData.get("entry");

  if (!entry) entry = "categories";

  let categoryId = formData.get("CategoryId");
  let parentId = formData.get("ParentId");
  let childId = formData.get("ChildId");
  let name = formData.get("name");

  let brand = formData.get("brand");
  let model = formData.get("model");
  let quantity = formData.get("quantity");
  let price = formData.get("price");

  let id = formData.get("id");
  let newId = formData.get("newId");

  let description = formData.get("description");
  let image = formData.get("image");

  let category = { name: undefined, val: undefined };
  let updatedId = { name: undefined, val: undefined };

  if (newId && newId !== id) updatedId = { name: "id", val: newId };
  if (!id) {
    let idName = name.toLowerCase();
    let array = idName.split(/ and| &|, /);
    idName = array[0];
    idName = idName.replace(/\s/g, "-");
    formData.set("id", idName);
    id = formData.get("id");
  }

  if (childId !== null) {
    category = { name: "ChildId", val: childId };
  } else if (parentId !== null) {
    category = { name: "ParentId", val: parentId };
  } else if (categoryId !== null) {
    category = { name: "CategoryId", val: categoryId };
  }

  const writeToDb = async (dir = null) => {
    if (entry !== "items") {
      formData.set("image", dir);
      image = formData.get("image");

      try {
        const res = await prisma[entry].update({
          where: { id: id },
          data: {
            [updatedId.name]: updatedId.val,
            name: name,
            brand: brand ? brand : undefined,
            model: model ? model : undefined,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            price: price ? parseFloat(price) : undefined,
            description: description ? description : undefined,
            image: image !== null ? image : undefined,
            [category.name]: category.val,
          },
        });
        return { success: "Updated successfully!" };
      } catch (error) {
        return { error: `Error Updating Item. \n ${error}` };
      }
    } else {
      try {
        const res = await prisma[entry].update({
          where: { id: id },
          data: {
            [updatedId.name]: updatedId.val,
            name: name,
            brand: brand ? brand : undefined,
            model: model ? model : undefined,
            quantity: quantity ? parseInt(quantity, 10) : undefined,
            price: price ? parseFloat(price) : undefined,
            description: description ? description : undefined,
            images: dir !== null ? dir : undefined,
            [category.name]: category.val,
          },
        });
        return { success: "Updated successfully!" };
      } catch (error) {
        return { error: `Error Updating Item. \n ${error}` };
      }
    }
  };
  if (!file) {
    const query = await writeToDb();
    if (query?.error) return { error: `Error updating item \n ${error}` };
    else {
      revalidatePath("/collection");
      revalidatePath("/dashboard");
      revalidateTag("search");
      return { success: `Updated Successfully!` };
    }
  } else if (typeof file === "string" && entry !== "items") {
    const query = await writeToDb();
    if (query?.error) return { error: `Error updating item \n ${error}` };
    else {
      revalidatePath("/collection");
      revalidatePath("/dashboard");
      revalidateTag("search");
      return { success: `Updated Successfully!` };
    }
  } else {
    let relativeUploadDir;
    if (process.env.NODE_ENV === "development") {
      if (entry !== "items") {
        relativeUploadDir = `/uploads/${entry}/${category.val}`;
      } else relativeUploadDir = `/uploads/${entry}/${category.val}/${id}`;
    } else {
      if (entry !== "items") {
        relativeUploadDir = `/uploads/${entry}/${category.val}`;
      } else relativeUploadDir = `/uploads/${entry}/${category.val}/${id}`;
    }

    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    const delDir = join(process.cwd(), "public");

    try {
      await stat(uploadDir);
    } catch (e) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        return { error: `Error Updating Item. \n ${e}` };
      }
    }

    try {
      if (entry !== "items") {
        const oldFile = formData.get("image");
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        const filename = `${file.name.replace(
          /\.[^/.]+$/,
          ""
        )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

        // Delete existing file if any
        if (oldFile) {
          try {
            await unlink(`${delDir}/${oldFile}`);
          } catch (error) {
            return { error: `Error while removing old image/s \n ${error}` };
          }
        }

        try {
          await writeFile(`${uploadDir}/${filename}`, buffer);
        } catch (error) {
          return { error: `Error creating image/s files \n ${error}` };
        }

        let imageUrl = `${relativeUploadDir}/${filename}`;

        const query = await writeToDb(imageUrl);
        if (query?.error) return { error: `Error updating item \n ${error}` };
        else {
          revalidatePath("/collection");
          revalidatePath("/dashboard");
          revalidateTag("search");
          return { success: `Updated Successfully!` };
        }
      } else {
        let oldFile = formData.get("images");
        if (oldFile && oldFile !== "null") {
          oldFile = oldFile.split(",");
          oldFile.map((oldImg) => unlink(`${delDir}/${oldImg}`));
          formData.delete("images");
        }
        const formDataEntryValues = Array.from(formData.values());
        let imageUrl = [];
        for (const formDataEntryValue of formDataEntryValues) {
          if (
            typeof formDataEntryValue === "object" &&
            "arrayBuffer" in formDataEntryValue
          ) {
            const file = formDataEntryValue;
            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(`${uploadDir}/${file.name}`, buffer);
            imageUrl.push(`${relativeUploadDir}/${file.name}`);
          }
        }
        const query = await writeToDb(imageUrl);
        if (query?.error) return { error: `Error updating item \n ${error}` };
        else {
          revalidatePath("/collection");
          revalidatePath("/dashboard");
          revalidateTag("search");
          return { success: `Updated Successfully!` };
        }
      }
    } catch (e) {
      return { error: `Error uploading file: ` };
    }
  }
}

export async function deleteItem(entry, data) {
  "use server";

  const removeFromDb = async () => {
    try {
      await prisma[entry].delete({
        where: {
          id: data.id,
        },
      });
    } catch (error) {
      return { error: `Error Removing Item \n ${error}` };
    }
  };

  const delDir = join(process.cwd(), "public");

  if (entry !== "items") {
    if (data.image) {
      try {
        unlink(`${delDir}/${data.image}`);
      } catch (e) {
        return { error: `Error removing image file: ${error}` };
      }
    }
  } else {
    let images = data.images;
    let dir = `${delDir}/uploads/${entry}/${data.ChildId}/${data.id}/`;

    if (images) {
      try {
        fs.rm(
          dir,
          {
            recursive: true,
            force: true,
          },
          (err) => {
            if (err) {
              return { error: `Error removing image file: ${err}` };
            }
          }
        );
        const query = await removeFromDb();
        if (query?.error)
          return { error: `Error removing item. \n Please try again later.` };
        else {
          revalidateTag("search");
          revalidatePath("/collection");
          revalidatePath("/dashboard");
          return { success: "Item removed successfully!" };
        }
      } catch (e) {
        const query = await removeFromDb();
        if (query?.error)
          return {
            error: `Error removing item. \n Please try again later.`,
            e: `Problem with file removal \n ${e}`,
          };
        else {
          revalidateTag("search");
          revalidatePath("/collection");
          revalidatePath("/dashboard");
          return { success: "Item removed successfully!" };
        }
      }
    } else {
      const query = await removeFromDb();
      if (query?.error)
        return { error: `Error removing item. \n Please try again later.` };
      else {
        revalidateTag("search");
        revalidatePath("/collection");
        revalidatePath("/dashboard");
        return { success: "Item removed successfully!" };
      }
    }
  }
}
