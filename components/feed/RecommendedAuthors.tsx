export function RecommendedAuthors() {
  const authors = [
    { name: 'Sarah Chen', username: 'sarahchen', specialty: 'Design & UX', followers: '12.5K' },
    { name: 'Michael Ross', username: 'mross', specialty: 'Web Development', followers: '8.2K' },
    { name: 'Emma Wilson', username: 'emmawrites', specialty: 'Tech Writing', followers: '15.1K' },
  ]

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Recommended Authors</h3>
      <div className="space-y-5">
        {authors.map((author, idx) => (
          <div key={idx} className="flex items-start gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-white/80 transition-colors">
                {author.name}
              </p>
              <p className="text-xs text-white/50">{author.specialty}</p>
              <p className="text-xs text-white/40 mt-1">{author.followers} followers</p>
            </div>
            <button className="text-xs font-medium text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}