import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
  const router = useRouter();
  const pathSegments = router.asPath.split("?")[0].split("/").filter(Boolean);

  // Don't show breadcrumbs on the main admin page
  if (pathSegments.length === 1 && pathSegments[0] === "admin") {
    return null;
  }

  const getBreadcrumbName = (segment, index, segments) => {
    if (segment === "admin") return "Admin";
    if (segment === "products") return "Products";
    if (segment === "product-create") return "Create Product";
    if (segment === "product-edit") return "Edit Product";
    if (segment === "product-detailed") return "Product Details";
    if (segment === "categories") return "Categories";
    if (segment === "orders") return "Orders";
    if (segment === "settings") return "Settings";
    if (segment === "client") return "Users";
    if (segment === "sizes") return "Sizes";
    
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Determine if we should show the Products breadcrumb
  const shouldShowProductsCrumb = (segments) => {
    return segments.some(s => 
      s === "product-edit" || 
      s === "product-create" || 
      s === "product-detailed"
    );
  };

  // Generate the breadcrumb items
  const generateBreadcrumbs = () => {
    const items = [];
    let skipNext = false;

    pathSegments.forEach((segment, index) => {
      if (skipNext) {
        skipNext = false;
        return;
      }

      // For product subpages, we'll handle them specially
      if (segment === "product-edit" || 
          segment === "product-create" || 
          segment === "product-detailed") {
        // Add Products breadcrumb if not already present
        if (!items.some(item => item.name === "Products")) {
          items.push({
            name: "Products",
            path: "/admin/products",
            isLast: false
          });
        }
        items.push({
          name: getBreadcrumbName(segment, index, pathSegments),
          path: `/${pathSegments.slice(0, index + 1).join("/")}`,
          isLast: true
        });
        skipNext = true;
        return;
      }

      items.push({
        name: getBreadcrumbName(segment, index, pathSegments),
        path: `/${pathSegments.slice(0, index + 1).join("/")}`,
        isLast: index === pathSegments.length - 1
      });
    });

    return items;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <div className="flex items-center text-sm text-gray-600 mb-4">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.isLast ? (
            <span className="text-teal-600 font-medium">{item.name}</span>
          ) : (
            <>
              <Link
                href={item.path}
                className="hover:text-teal-500 transition-colors"
              >
                {item.name}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;