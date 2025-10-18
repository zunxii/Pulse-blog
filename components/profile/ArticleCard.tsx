import { Clock, Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export function ArticleCard({ 
  id, 
  title, 
  excerpt, 
  publishedAt, 
  readTime, 
  views, 
  likes, 
  comments, 
  tags 
}: any) {
  return (
    <Link href={`/post/${id}`}>
      <article className="group p-6 my-3 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              {title}
            </h3>
            <p className="text-white/60 leading-relaxed line-clamp-2 mb-4">
              {excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, idx: number) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>{publishedAt}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/50">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
