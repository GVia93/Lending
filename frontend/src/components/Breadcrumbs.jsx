import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4" data-testid="breadcrumbs">
      <ol 
        className="flex items-center gap-2 text-sm"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <Link 
            to="/" 
            className="flex items-center gap-1 text-neutral-400 hover:text-orange-500 transition-colors"
            itemProp="item"
          >
            <Home className="w-4 h-4" />
            <span itemProp="name">Главная</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-center gap-2"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="w-4 h-4 text-neutral-600" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="text-neutral-400 hover:text-orange-500 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-neutral-300" itemProp="name">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={index + 2} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
