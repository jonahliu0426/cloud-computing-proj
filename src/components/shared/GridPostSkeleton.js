import React from "react";
import { useGridPostSkeletonStyles } from "../../styles";

function GridPostSkeleton() {
    const classes = useGridPostSkeletonStyles();

    return (
        <div className={classes.container}>
            {/* <div className={classes.headerSkeleton}>
                <div className={classes.avatarSkeleton} />
                <div className={classes.headerTextSkeleton}>
                    <div className={classes.primaryTextSkeleton} />
                    <div className={classes.secondaryTextSkeleton} />
                </div>
            </div> */}
            <div className={classes.mediaSkeleton} />
        </div>
    )
}

export default GridPostSkeleton;
