import { ReactElement } from "react";

type Props = {
  date: string;
  isContactEmail: boolean;
  contactEmail?: string;
};

export const DateELement = (props: Props): ReactElement => {
  const { date, isContactEmail, contactEmail } = props;

  const dateFormated = date.split("T");
  const timeData = dateFormated[1];
  const timeFormated = timeData.split(".");

  return (
    <div>
      {isContactEmail ? (
        <div>
          {dateFormated[0]} {"; "}
          {timeFormated[0]} <br />
          {contactEmail}
        </div>
      ) : (
        <div>
          {dateFormated[0]} <br />
          {timeFormated[0]}
        </div>
      )}
    </div>
  );
};
