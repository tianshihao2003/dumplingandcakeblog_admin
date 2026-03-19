import Link from "next/link";
import { listFilesRecursive } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function MomentsIndexPage() {
  const files = await listFilesRecursive("src/content/moments/");
  
  return (
    <div>
      {/* 面包屑导航 */}
      <div className="mb-4 text-sm text-gray-600">
        <a href="/" className="hover:text-gray-900">仪表盘</a> 
        <span className="mx-2">→</span> 
        <span className="text-gray-900">动态</span>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">动态管理</h1>
        <Link
          href="/moments/new"
          className="wp-button wp-button-primary"
        >
          新建动态
        </Link>
      </div>
      
      <div className="wp-card">
        <div className="wp-card-header">
          <p className="text-sm text-gray-600">
            仓库路径：<code>src/content/moments/</code>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="wp-table">
            <thead>
              <tr>
                <th>
                  标题
                </th>
                <th>
                  路径
                </th>
                <th>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((path) => (
                <tr key={path}>
                  <td>
                    {path.split("/").pop()?.replace(".md", "")}
                  </td>
                  <td>
                    <code className="text-sm text-gray-600">{path}</code>
                  </td>
                  <td>
                    <Link
                      href={`/moments/edit?path=${encodeURIComponent(path)}`}
                      className="wp-link mr-4"
                    >
                      编辑
                    </Link>
                    <button className="wp-link-danger">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

