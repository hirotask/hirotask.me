"use client";

import { useState } from "react";

interface DeleteButtonProps {
  slug: string;
  title: string;
}

export function DeleteButton({ slug, title }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!confirm(`"${title}" を削除しますか?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/pages/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      window.location.reload();
    } catch (error) {
      alert("削除に失敗しました");
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "削除"}
    </button>
  );
}
