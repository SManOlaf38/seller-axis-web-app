

const HeaderTitle = ({
  title,
  action
}: any) => {
  return (
    <div className="flex">
      <h3 className="text-lg">{title}</h3>
      {
        action
      }
    </div>
  )
}

export default HeaderTitle