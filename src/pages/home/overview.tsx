import React, { ReactNode } from "react";
import { Grid, Card, Typography, Divider, Skeleton } from "@arco-design/web-react";
import styles from "./overview.module.scss";
import { useUserStore } from "../../store";
import { APP_ICON, APP_INSTALL } from "../../assets/common";

const { Row, Col } = Grid;

type StatisticItemType = {
  icon?: any;
  title?: ReactNode;
  count?: ReactNode;
  loading?: boolean;
  unit?: ReactNode;
};

function StatisticItem(props: StatisticItemType) {
  const { icon, title, count, loading, unit } = props;
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon ? <img src={icon} alt="icon" /> : null}</div>
      <div>
        <Skeleton loading={loading} text={{ rows: 2, width: 60 }} animation>
          <div className={styles.title}>{title}</div>
          <div className={styles.count}>
            {count}
            <span className={styles.unit}>{unit}</span>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

function Overview(props: { appTotal: number; totalInstallations: number }) {
  const { user: userInfo } = useUserStore();
  const { appTotal = 0, totalInstallations = 0 } = props;

  return (
    <Card>
      <Typography.Title heading={5}>
        欢迎回来，
        {userInfo.nickname}
      </Typography.Title>
      <Divider />
      <Row>
        <Col flex={1}>
          <StatisticItem
            icon={APP_ICON}
            title={"应用总数"}
            count={appTotal}
            loading={false}
            unit={"个"}
          />
        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={APP_INSTALL}
            title={"应用安装次数"}
            count={totalInstallations}
            loading={false}
            unit={"次"}
          />
        </Col>
        {/* <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconComments />}
            title={"日新增评论"}
            count={data.increaseComments}
            loading={loading}
            unit={"个"}
          />
        </Col>
        <Divider type="vertical" className={styles.divider} />
        <Col flex={1}>
          <StatisticItem
            icon={<IconIncrease />}
            title={"较昨日新增"}
            count={
              <span>
                {data.growthRate}{" "}
                <IconCaretUp style={{ fontSize: 18, color: "rgb(var(--green-6))" }} />
              </span>
            }
            loading={loading}
          />
        </Col> */}
      </Row>
      <Divider />
    </Card>
  );
}

export default Overview;
