import CloseSvg from '@/resources/svg/Close';
import Background from '@/resources/svg/Background';
import RenderStars from '@/components/Pins/StarRendering';

type PinProps = {
  uuid: string;
  name: string;
  desc: string;
  rating: number;
  comments: CommentProps[];
};

type CommentProps = {
  author: string;
  text: string;
};

function Pins({ ...props }: PinProps) {
  const allStars: JSX.Element[] = RenderStars(props.rating);
  const ratingAsString = props.rating.toString();

  return (
    <section
      id={props.uuid}
      className="w-full h-screen p-5 text-default-font flex flex-col"
    >
      <div className="w-full relative overflow-hidden rounded-t-3xl mb-8">
        {/* <img
              src={`${Background}`}
              alt={`Picture of ${props.name}`}
              className=""
            ></img> */}
        <Background width="400" height="250" />
        <div
          id="close-button"
          className="absolute top-2 right-2 bg-default-font/50 rounded-full"
        >
          <CloseSvg width="40" height="40" />
        </div>
      </div>
      <div
        id="lower-wrapper"
        className="flex flex-col justify-between align-center"
      >
        <div className="text-center text-3xl">
          <h1>{props.name}</h1>
        </div>
        <div className="text-center">
          <ul className="inline" title={`Bewertung: ${ratingAsString}`}>
            {allStars.map((star, index) => (
              <li key={index} className="inline">
                {star}
              </li>
            ))}
          </ul>
          <p>
            <a href="#">See Reviews</a>
          </p>
        </div>
        <div className="text-center">
          <ul>
            <li>
              <span className="">Description:</span> {props.desc}
            </li>
            <li>
              {/* NEEDS REWORK
                        Too many comments will result bugs
                    */}
              <span className="">Comments</span>
              <ul>
                {props.comments.map((comment, index) => (
                  <div key={index}>
                    <li>
                      <span className="">Author:</span> {comment.author}
                    </li>
                    <li>
                      <span className="">Nachricht:</span> {comment.text}
                    </li>
                  </div>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export { Pins };
