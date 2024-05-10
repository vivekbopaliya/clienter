import { db } from "@/lib/db";
import { getDataFromToken } from "@/lib/hooks/getDataFromToken";

async function deleteFolderAndSubFolders(folderId: string) {
  try {
    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
      },
    });

    if (!folder) {
      console.error("Folder not found: ", folderId);
      return; 
    }

    // Delete files inside folder
    const filesToDeleteInsideFolder = await db.file.findMany({
      where: {
        folderId: folder.id,
      },
    });

    for (const file of filesToDeleteInsideFolder) {
      await db.file.delete({
        where: {
          id: file.id,
        },
      });
    }

    // Delete subfolders inside folders
    const subFoldersToDelete = await db.folder.findMany({
      where: {
        parentFolderId: folder.id,
      },
    });

    for (const subFolder of subFoldersToDelete) {
      await deleteFolderAndSubFolders(subFolder.id);
    }

    // eventually delete the folder itself
    await db.folder.delete({
      where: {
        id: folder.id,
      },
    });
  } catch (error) {
    console.error("Error deleting folder and subfolders:", error);
    throw error; 
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authUser = await getDataFromToken();

    if (!authUser) {
      return new Response("Unauthorized.", { status: 401 });
    }

    const folder = await db.folder.findFirst({
      where: {
        id: body.id,
      },
    });

    if (!folder) {
      return new Response("Folder not found.", { status: 404 });
    }

    await deleteFolderAndSubFolders(folder.id);

    return new Response("Folder and its contents deleted successfully.", {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return new Response("Internal server error.", { status: 500 });
  }
}
